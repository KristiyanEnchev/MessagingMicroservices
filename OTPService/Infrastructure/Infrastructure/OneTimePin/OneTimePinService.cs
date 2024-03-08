namespace Infrastructure.OneTimePin
{
    using System.Linq;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Caching.Memory;

    using Application.Interfaces.OneTimePin;

    public class OneTimePinService : IOneTimePinService
    {
        private readonly IMemoryCache _cache;
        private readonly RandomGenerator _randomGenerator;

        public OneTimePinService(IMemoryCache cache, RandomGenerator randomGenerator)
        {
            _cache = cache;
            _randomGenerator = randomGenerator;
        }

        public class OneTimePassword
        {
            public string OtpId { get; set; }
            public string Otp { get; set; }
            public string Username { get; set; }
            public DateTime ExpiryTime { get; set; }
        }

        public string GenerateOtp(string username, int expirationMinutes, PasswordOptions opts = null)
        {
            string otp = GenerateRandomPassword(opts);

            var otpId = Guid.NewGuid().ToString();

            var otpDetails = new OneTimePassword
            {
                OtpId = otpId,
                Otp = otp,
                Username = username,
                ExpiryTime = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            _cache.Set(otpId, otpDetails, new MemoryCacheEntryOptions
            {
                AbsoluteExpiration = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Priority = CacheItemPriority.High,
            });

            return otpId;
        }

        public bool ValidateOtp(string otpId, string username, string otp)
        {
            if (!_cache.TryGetValue(otpId, out OneTimePassword otpDetails))
            {
                return false;
            }

            bool isValid = otpDetails.Username == username && otpDetails.Otp == otp && otpDetails.OtpId == otpId && DateTime.UtcNow <= otpDetails.ExpiryTime;

            if (isValid)
            {
                _cache.Remove(otpId);
            }

            return isValid;
        }

        public string GenerateRandomPassword(PasswordOptions opts = null)
        {
            if (opts == null) opts = new PasswordOptions()
            {
                RequiredLength = 10,
                RequiredUniqueChars = 4,
                RequireDigit = true,
                RequireLowercase = true,
                RequireNonAlphanumeric = true,
                RequireUppercase = true
            };

            string[] randomChars = new[] {
                "ABCDEFGHJKLMNOPQRSTUVWXYZ",
                "abcdefghijkmnopqrstuvwxyz",
                "0123456789",
                "!@$?_-"
            };

            List<char> chars = new List<char>();

            if (opts.RequireUppercase)
                chars.Insert(_randomGenerator.Next(0, chars.Count),
                    randomChars[0][_randomGenerator.Next(0, randomChars[0].Length)]);

            if (opts.RequireLowercase)
                chars.Insert(_randomGenerator.Next(0, chars.Count),
                    randomChars[1][_randomGenerator.Next(0, randomChars[1].Length)]);

            if (opts.RequireDigit)
                chars.Insert(_randomGenerator.Next(0, chars.Count),
                    randomChars[2][_randomGenerator.Next(0, randomChars[2].Length)]);

            if (opts.RequireNonAlphanumeric)
                chars.Insert(_randomGenerator.Next(0, chars.Count),
                    randomChars[3][_randomGenerator.Next(0, randomChars[3].Length)]);

            for (int i = chars.Count; i < opts.RequiredLength
                || chars.Distinct().Count() < opts.RequiredUniqueChars; i++)
            {
                string rcs = randomChars[_randomGenerator.Next(0, randomChars.Length)];
                chars.Insert(_randomGenerator.Next(0, chars.Count),
                    rcs[_randomGenerator.Next(0, rcs.Length)]);
            }

            return new string(chars.ToArray());
        }
    }
}