namespace Web
{
    using System.Net;
    using System.Text.Json;
    using System.Reflection;
    using System.Security.Authentication;
    using System.Security.Claims;
    using System.Security.Cryptography;
    using System.IdentityModel.Tokens.Jwt;

    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Server.Kestrel.Https;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.Cookies;

    using Application;
    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Web.Services;
    using Web.Extensions.Cors;
    using Web.Extensions.Json;
    using Web.Extensions.Swagger;
    using Web.Extensions.Healtchecks;
    using Web.Extensions.Middleware;

    using Infrastructure;

    using Persistence.Constants;

    using Models.Settings;
    using Models.Settings.Cors;
    using Models.Settings.Post;

    using Domain.Entities.Identity;

    public static class Startup
    {
        public static IServiceCollection AddWeb(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpContextAccessor();
            services.AddControllers()
                .AddApplicationPart(Assembly.GetExecutingAssembly())
                .ConfigureJsonOptions();

            services.AddErrorHandler();
            services.AddConfigurationSettings(config);

            services.AddScoped<IUser, CurrentUser>();
            
            services.AddApplication();
            services.AddInfrastructure(config);

            services.AddCustomAuthentication(config);
            services.AddCustomAuthorization();

            services.AddSwaggerDocumentation();

            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddCustomCorsPolicy(config);

            services.AddHealth(config);

            return services;
        }

        public static IApplicationBuilder UseWeb(this IApplicationBuilder builder, IConfiguration configuration)
        {
            builder.UseSwaggerDocumentation()
                    .UseStaticFiles()
                    .UseHttpsRedirection()
                    .UseErrorHandler()
                    .UseRouting()
                    .UseAuthentication()
                    .UseCustomCorsPolicy(configuration)
                    .UseAuthorization()
                    .UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                        endpoints.MapHealthCheck();
                    });

            return builder;
        }


        public static IServiceCollection AddConfigurations(this IServiceCollection services, IWebHostBuilder hostBulder, IWebHostEnvironment env)
        {
            hostBulder.ConfigureAppConfiguration(config =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                config.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);
                config.AddEnvironmentVariables();
                config.Build();
            });

            AddKestrelConfig(hostBulder);

            return services;
        }

        private static IServiceCollection AddConfigurationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<ApplicationSettings>(configuration.GetSection(nameof(ApplicationSettings)));
            services.Configure<CorsSettings>(configuration.GetSection(nameof(CorsSettings)));
            services.Configure<EmailSettings>(configuration.GetSection(nameof(EmailSettings)));
            services.Configure<SmsSettings>(configuration.GetSection(nameof(SmsSettings)));
            services.Configure<NotificationSettings>(configuration.GetSection(nameof(NotificationSettings)));
            services.Configure<OtpSettings>(configuration.GetSection(nameof(OtpSettings)));

            return services;
        }

        private static IWebHostBuilder AddKestrelConfig(IWebHostBuilder builder)
        {
            builder.ConfigureKestrel((context, serverOptions) =>
            {
                serverOptions.ListenAnyIP(8080);

                serverOptions.ConfigureHttpsDefaults(options =>
                {
                    options.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
                    options.ClientCertificateMode = ClientCertificateMode.AllowCertificate;
                });
            });

            return builder;
        }

        private static IServiceCollection AddCustomAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var appSettings = configuration.GetSection(nameof(ApplicationSettings)).Get<ApplicationSettings>();
            
            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidIssuer = appSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = appSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                
                services
                    .AddAuthentication(authentication =>
                    {
                        authentication.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                        authentication.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                        authentication.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                    .AddJwtBearer(options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.SaveToken = true;
                        options.TokenValidationParameters = tokenValidationParameters;
                        
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = async context =>
                            {
                                var serviceScope = context.HttpContext.RequestServices.CreateScope();
                                var keyService = serviceScope.ServiceProvider.GetRequiredService<IRsaKeyService>();
                                var activeKey = await keyService.GetActiveKeyAsync();

                                if (activeKey != null)
                                {
                                    var rsa = RSA.Create();
                                    rsa.ImportRSAPublicKey(Convert.FromBase64String(activeKey.PublicKey), out _);
                                    context.Options.TokenValidationParameters.IssuerSigningKey =
                                        new RsaSecurityKey(rsa) { KeyId = activeKey.Id };
                                }
                            },
                            OnChallenge = async context =>
                            {
                                context.HandleResponse();
                                var errorResponse = new
                                {
                                    success = false,
                                    data = (object)null!,
                                    errors = new List<string> { "Authentication failed. Access is denied." }
                                };
                                var response = context.Response;
                                response.ContentType = "application/json";
                                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                                var jsonOptions = JsonSerializerOptionsExtensions.GetDefaultOptions();
                                await response.WriteAsync(JsonSerializer.Serialize(errorResponse, jsonOptions));
                            },
                            OnTokenValidated = async context =>
                            {
                                if (context.HttpContext.GetEndpoint()?.DisplayName?.Contains("Logout", StringComparison.OrdinalIgnoreCase) == true)
                                    return;

                                var token = context.SecurityToken as JwtSecurityToken;
                                if (token == null) return;
                                
                                var serviceProvider = context.HttpContext.RequestServices;
                                var refreshTokenService = serviceProvider.GetRequiredService<IRefreshTokenService>();

                                if (await refreshTokenService.IsTokenRevokedAsync(token.RawData))
                                {
                                    context.Fail("Token has been revoked");
                                }
                            }
                        };
                    });
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to configure JWT authentication", ex);
            }
            
            services.AddAuthentication()
                .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    options.Cookie.Name = "IdentityApi";
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SameSite = SameSiteMode.Lax;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                    options.SlidingExpiration = true;
                    options.LoginPath = "/api/identity/login-with-cookie";
                    options.LogoutPath = "/api/identity/logout-cookie";
                    options.AccessDeniedPath = "/api/identity/access-denied";

                    options.Events = new CookieAuthenticationEvents
                    {
                        OnValidatePrincipal = async context =>
                        {
                            var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<User>>();
                            var userPrincipal = context.Principal;

                            var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                            if (string.IsNullOrEmpty(userId))
                            {
                                context.RejectPrincipal();
                                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                                return;
                            }

                            var user = await userManager.FindByIdAsync(userId);
                            if (user == null || !user.IsActive)
                            {
                                context.RejectPrincipal();
                                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                                return;
                            }

                            var signInManager = context.HttpContext.RequestServices.GetRequiredService<SignInManager<User>>();
                            if (!await signInManager.ValidateSecurityStampAsync(user, userPrincipal.FindFirstValue("AspNet.Identity.SecurityStamp")))
                            {
                                context.RejectPrincipal();
                                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                            }
                        }
                    };
                });

            return services;
        }

        private static IServiceCollection AddCustomAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
                options.AddPolicy(Policies.CanDelete, policy => policy.RequireRole(Roles.Administrator)));

            return services;
        }

        internal static IServiceCollection AddErrorHandler(this IServiceCollection services)
        {
            return services.AddTransient<ErrorHandlerMiddleware>();
        }

        internal static IApplicationBuilder UseErrorHandler(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ErrorHandlerMiddleware>();
        }
    }
}