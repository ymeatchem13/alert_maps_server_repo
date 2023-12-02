using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace AlertMap.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscribeController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public SubscribeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public JsonResult Post([FromBody] EmailMessage emailMessage)
        {
            string query = @"
                insert into dbo.Email values
                (
                '" + emailMessage.To + @"'
                )
                ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AlertAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Added Successfully");
        }

    }
}
