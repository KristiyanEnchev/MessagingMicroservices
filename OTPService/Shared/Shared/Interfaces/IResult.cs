namespace Shared.Interfaces
{
    using System.Collections.Generic;

    public interface IResult<T>
    {
        bool Success { get; set; }
        T Data { get; set; }
        List<string> Errors { get; set; }
    }
}
