namespace Web.Extentions.Logging
{
    using Microsoft.AspNetCore.Builder;

    using Serilog;
    using Serilog.Events;
    using Serilog.Exceptions;
    using Serilog.Formatting.Compact;

    public static class SerilogExtension
    {
        public static void RegisterSerilog(this WebApplicationBuilder builder)
        {
            _ = builder.Host.UseSerilog((_, sp, serilogConfig) =>
            {
                string appName = "Authentication.Api";

                ConfigureEnrichers(serilogConfig, appName);
                ConfigureConsoleLogging(serilogConfig, false);
                SetMinimumLogLevel(serilogConfig, "information");
                OverideMinimumLogLevel(serilogConfig);
                Console.WriteLine(appName);
            });
        }

        private static void ConfigureEnrichers(LoggerConfiguration serilogConfig, string appName)
        {
            serilogConfig
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", appName)
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithMachineName()
                    .Enrich.WithProcessId()
                    .Enrich.WithThreadId()
                    .Enrich.FromLogContext();
        }

        private static void ConfigureConsoleLogging(LoggerConfiguration serilogConfig, bool structuredConsoleLogging)
        {
            if (structuredConsoleLogging)
            {
                serilogConfig.WriteTo.Async(wt => wt.Console(new CompactJsonFormatter()));
            }
            else
            {
                serilogConfig.WriteTo.Async(wt => wt.Console());
            }
        }

        private static void OverideMinimumLogLevel(LoggerConfiguration serilogConfig)
        {
            serilogConfig
                         .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                         .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                         .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Error);
        }

        private static void SetMinimumLogLevel(LoggerConfiguration serilogConfig, string minLogLevel)
        {
            switch (minLogLevel.ToLower())
            {
                case "debug":
                    serilogConfig.MinimumLevel.Debug();
                    break;
                case "information":
                    serilogConfig.MinimumLevel.Information();
                    break;
                case "warning":
                    serilogConfig.MinimumLevel.Warning();
                    break;
                default:
                    serilogConfig.MinimumLevel.Information();
                    break;
            }
        }
    }
}
