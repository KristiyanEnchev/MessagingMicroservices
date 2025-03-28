namespace Web.Controllers.Identity
{
    using System.Security.Cryptography;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.Extensions.Logging;

    using Application.Interfaces.Identity;

    using Swashbuckle.AspNetCore.Annotations;

    using Persistence.Constants;

    public class JwksController : ApiController
    {
        private readonly IRsaKeyService _rsaKeyService;
        private readonly ILogger<JwksController> _logger;

        public JwksController(IRsaKeyService rsaKeyService, ILogger<JwksController> logger)
        {
            _rsaKeyService = rsaKeyService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [SwaggerOperation("Get JWKS", "Returns the JSON Web Key Set for token validation")]
        public async Task<ActionResult<IDictionary<string, List<JsonWebKey>>>> GetJwks()
        {
            try
            {
                var activeKey = await _rsaKeyService.GetActiveKeyAsync();

                if (activeKey == null)
                {
                    _logger.LogWarning("No active RSA key found when trying to retrieve JWKS");
                    return NotFound("No active RSA keys found");
                }

                using var rsa = RSA.Create();
                rsa.ImportRSAPublicKey(Convert.FromBase64String(activeKey.PublicKey), out _);

                var jwk = JsonWebKeyConverter.ConvertFromRSASecurityKey(
                    new RsaSecurityKey(rsa) { KeyId = activeKey.Id });

                jwk.Use = "sig"; // signature
                jwk.Alg = SecurityAlgorithms.RsaSha256;

                var result = new Dictionary<string, List<JsonWebKey>>
                {
                    { "keys", new List<JsonWebKey> { jwk } }
                };

                _logger.LogInformation("JWKS requested and returned for key ID: {KeyId}", activeKey.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving JWKS");
                return StatusCode(500, "Error retrieving key set");
            }
        }

        [HttpPut]
        [Authorize(Roles = Roles.Administrator)]
        [SwaggerOperation("Re-generate RSA Keys", "")]
        public async Task<IActionResult> ReGeneratekeys()
        {
            return Ok(_rsaKeyService.GenerateNewRsaKeyPairAsync());
        }
    }
}