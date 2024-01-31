namespace ApiGateways.Extentions
{
    using System.Text;

    using Microsoft.OpenApi.Models;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.AspNetCore.Authentication.JwtBearer;

    using Ocelot.DependencyInjection;

    public static class ServiceCollectionExtention
    {
        public static IServiceCollection AddCustomAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var secret = configuration
            .GetSection("Secrets")
            .GetValue<string>("Secret")!;

            var key = Encoding.UTF8.GetBytes(secret);

            services
                .AddAuthentication(authentication =>
                {
                    authentication.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    authentication.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            return services;
        }

        public static IServiceCollection AddOcelotWithSwagger(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOcelot(configuration);
            services.AddCacheManager();
            services.AddSwaggerForOcelot(configuration,
                (o) =>
                {
                    o.GenerateDocsForAggregates = true;
                    o.GenerateDocsDocsForGatewayItSelf(opt =>
                    {
                        opt.GatewayDocsTitle = "ApiGataway";
                        opt.GatewayDocsOpenApiInfo = new()
                        {
                            Version = "v1",
                            Title = "ApiGataway.Api",
                            Description = "Provide basic ApiGataway functionality.",
                            Contact = new OpenApiContact
                            {
                                Name = "Kris" ?? "",
                                Email = "kristiqnenchevv@gmail.com" ?? "",
                                Url = null
                            }
                        };
                        opt.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                        {
                            Name = "Authorization",
                            In = ParameterLocation.Header,
                            Type = SecuritySchemeType.Http,
                            Scheme = JwtBearerDefaults.AuthenticationScheme,
                            BearerFormat = "JWT",
                            Description = "Input your Bearer token directly in the field to access this API",
                        });
                        opt.AddSecurityRequirement(new OpenApiSecurityRequirement()
                          {
                             {
                                new OpenApiSecurityScheme
                                {
                                    Reference = new OpenApiReference
                                    {
                                        Type = ReferenceType.SecurityScheme,
                                        Id = JwtBearerDefaults.AuthenticationScheme,
                                    },
                                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                                    Name = JwtBearerDefaults.AuthenticationScheme,
                                    In = ParameterLocation.Header,
                                }, new List<string>()
                             },
                          });
                    });
                });

            return services;
        }
    }
}