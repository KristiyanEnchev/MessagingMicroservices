﻿namespace Web.Services
{
    using System.Security.Claims;

    using Microsoft.AspNetCore.Http;

    using Application.Interfaces;

    public class CurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string? _userIdOverride;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? Id => _userIdOverride ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        public void SetUserId(string userId)
        {
            _userIdOverride = userId;
        }
    }
}