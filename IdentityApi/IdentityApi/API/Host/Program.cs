namespace Host
{
    using Microsoft.AspNetCore.Builder;

    using Serilog;

    using Web;
    using Web.Extensions.Logging;

    using Infrastructure;

    public class Program
    {
        public static async Task Main(string[] args)
        {
            StaticLogger.EnsureInitialized();
            Log.Information("Server Booting Up...");
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                builder.RegisterSerilog();
                builder.Services.AddConfigurations(builder.WebHost, builder.Environment);
                builder.Services.AddWeb(builder.Configuration);

                var app = builder.Build();

                await app.Services.InitializeDatabase();

                app.UseWeb(builder.Configuration);
                app.Run();
            }
            catch (Exception ex) when (!ex.GetType().Name.Equals("HostAbortedException", StringComparison.Ordinal))
            {
                StaticLogger.EnsureInitialized();
                Log.Fatal(ex, "Unhandled exception");
            }
            finally
            {
                StaticLogger.EnsureInitialized();
                Log.Information("Server Shutting down...");
                Log.CloseAndFlush();
            }
        }
    }
}