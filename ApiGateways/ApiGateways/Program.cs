namespace ApiGateways
{
    using ApiGateways.Extentions;
    using ApiGateways.Extentions.Cors;

    using Ocelot.Middleware;

    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services
                .AddCustomAuthentication(builder.Configuration)
                .AddAuthorization()
                .AddControllers();

            builder.Services
                .AddEndpointsApiExplorer()
                .AddSwaggerGen();

            builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);

            builder.Services.AddOcelotWithSwagger(builder.Configuration);
            builder.Services.AddCustomCorsPolicy(builder.Configuration);


            var app = builder.Build();

            app.UseSwagger();
            app.UseHttpsRedirection();
            app.MapControllers();
            app.UseAuthentication();
            app.UseCustomCorsPolicy(builder.Configuration);
            app.UseAuthorization();

            app.UseSwaggerForOcelotUI(opt =>
            {
                opt.PathToSwaggerGenerator = "/swagger/docs";
            });

            await app.UseOcelot();

            app.Run();
        }
    }
}