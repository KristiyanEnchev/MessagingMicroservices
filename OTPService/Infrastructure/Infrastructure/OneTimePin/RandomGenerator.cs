namespace Infrastructure.OneTimePin
{
    using System.Security.Cryptography;

    public class RandomGenerator : IDisposable
    {
        private readonly RandomNumberGenerator csp;

        public RandomGenerator(RandomNumberGenerator randomNumberGenerator)
        {
            csp = randomNumberGenerator;
        }

        public int Next(int minValue, int maxExclusiveValue)
        {
            if (minValue == maxExclusiveValue)
                return minValue;

            if (minValue > maxExclusiveValue)
            {
                throw new ArgumentOutOfRangeException($"{nameof(minValue)} must be lower than {nameof(maxExclusiveValue)}");
            }

            var diff = (long)maxExclusiveValue - minValue;
            var upperBound = uint.MaxValue / diff * diff;

            uint ui;
            do
            {
                ui = GetRandomUInt();
            } while (ui >= upperBound);

            return (int)(minValue + (ui % diff));
        }

        private uint GetRandomUInt()
        {
            var randomBytes = GenerateRandomBytes(sizeof(uint));
            return BitConverter.ToUInt32(randomBytes, 0);
        }

        private byte[] GenerateRandomBytes(int bytesNumber)
        {
            var buffer = new byte[bytesNumber];
            csp.GetBytes(buffer);
            return buffer;
        }

        private bool _disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                csp?.Dispose();
            }

            _disposed = true;
        }
    }
}