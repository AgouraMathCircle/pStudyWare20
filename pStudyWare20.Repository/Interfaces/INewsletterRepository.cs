namespace pStudyWare20.Repository.Interfaces

{

    public interface INewsletterRepository

    {

        Task<bool> EmailExistsAsync(string email);



        Task AddSubscriptionAsync(string email);

    }

}


