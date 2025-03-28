namespace Application.Interfaces
{
    public interface IIpAddressService
    {
        string GetCurrentIpAddress();
        string GetOriginFromRequest();
        string? GetIpAddress();
    }
}