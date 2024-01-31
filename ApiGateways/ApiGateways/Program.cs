namespace ApiGateway
{
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.OpenApi.Models;

    using Ocelot.DependencyInjection;
    using Ocelot.Middleware;

    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthentication(authentication =>
            {
                authentication.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                authentication.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            });
            builder.Services.AddAuthorization();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
            builder.Services.AddOcelot(builder.Configuration);
            builder.Services.AddCacheManager();
            builder.Services.AddSwaggerForOcelot(builder.Configuration,
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

            var app = builder.Build();

            app.UseAuthentication();
            app.UseAuthorization();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
            }

            app.UseHttpsRedirection();

            app.MapControllers();

            app.UseSwaggerForOcelotUI(opt =>
            {
                opt.PathToSwaggerGenerator = "/swagger/docs";
            });

            await app.UseOcelot();

            app.Run();
        }
    }
}