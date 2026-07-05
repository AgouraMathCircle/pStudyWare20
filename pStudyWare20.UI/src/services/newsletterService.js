import api from "./api";



class NewsletterService {

  async subscribe(email) {

    try {

      const response = await api.post("/Newsletter", {

        email: email.trim(),

      });

      return response.data;

    } catch (error) {

      const message =

        error.response?.data?.errorMessage ||

        error.response?.data?.message ||

        error.message ||

        "Unable to subscribe. Please try again.";

      throw new Error(message);

    }

  }

}



export default new NewsletterService();


