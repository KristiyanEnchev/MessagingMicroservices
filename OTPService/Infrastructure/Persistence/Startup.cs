﻿namespace Persistence
{
    using Microsoft.Data.SqlClient;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using Persistence.Contexts;

    public static class Startup
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext(configuration);

            return services;
        }

        public static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 2,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorNumbersToAdd: null
                    );
                }));
        }

        public static async Task InitializeDatabaseAsync(this IServiceProvider services, IConfiguration config)
        {
            var masterConnection = config.GetConnectionString("master");
            var targetDbName = "OTPService";

            using var conn = new SqlConnection(masterConnection);
            await conn.OpenAsync();

            var command = conn.CreateCommand();
            command.CommandText = $"IF DB_ID(N'{targetDbName}') IS NULL CREATE DATABASE [{targetDbName}]";
            await command.ExecuteNonQueryAsync();

            await conn.CloseAsync();
        }
    }
}