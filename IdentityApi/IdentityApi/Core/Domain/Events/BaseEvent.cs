namespace Domain.Events
{
    using System;
    using MediatR;

    public abstract class BaseEvent : INotification
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime DateOccurred { get; } = DateTime.UtcNow;
    }
}