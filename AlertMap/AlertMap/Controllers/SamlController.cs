using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Net.Http;
using System.Web;

namespace AlertMap.Controllers
{
    [Route("api/[controller]")]
    public class SamlController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public string displayName = "Alert Maps"; // String.Empty;

        public string emailAddress = "ucalertmaps@outlook.com"; // String.Empty;

        public SamlController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<User> GetUserData()
        {
            User user = new User();
            try
            {
                bool loaded = await GetSessionData();
                if (loaded == true)
                {
                    user.DisplayName = displayName;
                    user.EmailAddress = emailAddress;
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
            }
            return user;
        }

        private string CallExternalUrl(string url)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        return reader.ReadToEnd();
                    }
                }
            }
        }

        private async Task<bool> GetSessionData()
        {
            //string displayName = _httpContextAccessor.HttpContext.Request.Ser["displayName"];
            //var context = new HttpContext(new HttpRequest(null, "https://localhost/Shibboleth.sso/Session", null), new HttpResponse(null));
            //_user.GetContext();
            bool loaded = false;
            HttpClient client = new HttpClient();

            var request = new HttpRequestMessage(HttpMethod.Get, "https://sp.ucalertmaps.com/Shibboleth.sso/Session");
            request.Headers.TryAddWithoutValidation("displayName", "");
            request.Headers.TryAddWithoutValidation("eppn", "");

            HttpResponseMessage response = await client.SendAsync(request);
            if (response != null)
            {
                if ((int)response.StatusCode == 200)
                {
                    string a = CallExternalUrl("https://sp.ucalertmaps.com/Shibboleth.sso/Session");
                    var headers = response.Headers;
                    IEnumerable<string> emailaddresses;
                    IEnumerable<string> displaynames;

                    if (headers.TryGetValues("displayname", out displaynames))
                    {
                        displayName = displaynames.First();
                    }
                    if (headers.TryGetValues("mail", out emailaddresses))
                    {
                        emailAddress = emailaddresses.First();
                    }
                    loaded = true;
                }
            }

            //HttpContext httpContext = _httpContextAccessor.HttpContext;
            //string displayName = httpContext.GetServerVariable("displayName");
            //_user.GetContext();
            
            return loaded;
        }
    }
}
