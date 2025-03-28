namespace Web.Extensions.Json
{
    using System.Text.Json;
    using System.Text.Json.Serialization;

    using Microsoft.Extensions.DependencyInjection;

    public static class JsonSerializerOptionsExtensions
    {
        private static readonly JsonSerializerOptions _defaultOptions;

        static JsonSerializerOptionsExtensions()
        {
            _defaultOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = false
            };

            _defaultOptions.Converters.Add(new JsonStringEnumConverter());
        }

        public static JsonSerializerOptions GetDefaultOptions() => _defaultOptions;

        public static IMvcBuilder ConfigureJsonOptions(this IMvcBuilder builder)
        {
            return builder.AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = _defaultOptions.PropertyNamingPolicy;
                options.JsonSerializerOptions.DefaultIgnoreCondition = _defaultOptions.DefaultIgnoreCondition;

                foreach (var converter in _defaultOptions.Converters)
                {
                    options.JsonSerializerOptions.Converters.Add(converter);
                }
            });
        }
    }
}
