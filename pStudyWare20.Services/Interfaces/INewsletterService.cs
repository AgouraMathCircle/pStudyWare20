using pStudyWare20.Shared;



namespace pStudyWare20.Services.Interfaces

{

    public interface INewsletterService

    {

        NewsletterSubscribeResponse Subscribe(NewsletterSubscribeRequest request);

    }

}


