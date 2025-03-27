namespace Domain.Common
{
    using System.ComponentModel.DataAnnotations.Schema;

    using Domain.Events;
    using Domain.Interfaces;

    public abstract class BaseEntity : IEntity
    {
        private readonly List<BaseEvent> _domainEvents = new();

        protected BaseEntity()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public string Id { get; set; }

        [NotMapped]
        public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

        public void AddDomainEvent(BaseEvent domainEvent) => _domainEvents.Add(domainEvent);
        public void RemoveDomainEvent(BaseEvent domainEvent) => _domainEvents.Remove(domainEvent);
        public void ClearDomainEvents() => _domainEvents.Clear();
    }
}
