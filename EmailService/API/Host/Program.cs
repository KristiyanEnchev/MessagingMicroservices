namespace Host
{
    using Microsoft.AspNetCore.Builder;

    using Serilog;

    using Web;
    using Web.Extentions.Logging;

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
                builder.Services.AddWeb(builder.Configuration);

                var app = builder.Build();

                app.UseWeb();
                app.MapEndpoints();

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