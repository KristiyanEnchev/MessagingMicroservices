namespace Application.Interfaces.Identity
{
    using System.Threading.Tasks;
    
    using Domain.Entities.Identity;

    public interface IRsaKeyService
    {
        /// <summary>
        /// Gets the active RSA private key for token signing
        /// </summary>
        Task<string> GetActivePrivateKeyAsync();
        
        /// <summary>
        /// Gets the active RSA public key for token validation
        /// </summary>
        Task<string> GetActivePublicKeyAsync();
        
        /// <summary>
        /// Gets the complete active RSA key entity
        /// </summary>
        Task<RsaKey> GetActiveKeyAsync();
        
        /// <summary>
        /// Generates a new RSA key pair
        /// </summary>
        Task<RsaKey> GenerateNewRsaKeyPairAsync(int keySize = 2048);
        
        /// <summary>
        /// Rotates RSA keys by generating a new key and disabling old ones
        /// </summary>
        Task RotateRsaKeysAsync();
    }
}