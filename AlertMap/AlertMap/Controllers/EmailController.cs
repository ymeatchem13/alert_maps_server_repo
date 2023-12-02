using Microsoft.AspNetCore.Mvc;

namespace AlertMap.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public IActionResult SendEmail([FromBody] EmailMessage request)
        {
            _emailService.Send(request);

            return Ok();
        }

        [HttpGet]
        public IActionResult RetrieveEmail()
        {
            _emailService.ReceiveEmail();
            return Ok();
        }
    }
}
