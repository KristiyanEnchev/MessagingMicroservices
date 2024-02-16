namespace Web.Extentions.Filters
{
    using global::Hangfire.Common;
    using global::Hangfire.States;

    public class HangfireErrorHandlingFilter : JobFilterAttribute, IElectStateFilter
    {
        public void OnStateElection(ElectStateContext context)
        {
            var failedState = context.CandidateState as FailedState;
            if (failedState != null)
            {
                var exception = failedState.Exception;

                LogToExternalService(context.JobId, exception);

                // Optionally, we can prevent retries by changing the state:
                // context.SetState(new DeletedState());
            }
        }

        private void LogToExternalService(string jobId, Exception exception)
        {
            //var errorLog = new ErrorLog
            //{
            //    JobId = jobId,
            //    ExceptionMessage = exception.Message,
            //    Timestamp = DateTime.UtcNow
            //};

            // and here some AuditService

            Console.WriteLine($"Job {jobId} failed with exception {exception.Message}");
        }
    }
}
