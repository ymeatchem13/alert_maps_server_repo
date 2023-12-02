using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;

namespace AlertMap.Controllers
{
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CommentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            // Replace by using Stored Procedures with Parameters or Entity Framework to connect to the database
            string query = @"
                    select alert_id, comment_id, comment, user_name, added_date from dbo.Comments";
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

            List<object> list = new List<object>();

            foreach (DataRow dr in table.Rows)
            {
                object row = new ExpandoObject();
                var d = row as IDictionary<string, object>;
                foreach (DataColumn dc in table.Columns)
                {
                    d[dc.ColumnName] = dr[dc.ColumnName];
                }
                list.Add(row);
            }

            return new JsonResult(list);
        }

        [HttpPost]
        public JsonResult Post([FromBody] Comments comments)
        {
            string query = @"
                    insert into dbo.Comments values
                    (
                    '" + comments.alert_id + @"', 
                    '" + comments.comment + @"', 
                    '" + comments.user_name + @"', 
                    '" + comments.added_date + @"'

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

        [HttpPut]
        public JsonResult Put([FromBody] Comments comments)
        {
            string query = @"
                    update dbo.Comments set
                    comment = '" + comments.comment + @"'
                    where comment_id = " + comments.comment_id + @"
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

        [HttpDelete]
        public JsonResult Delete([FromRoute] int comment_id)
        {
            if (comment_id > 0)
            {
                string query = @"
                    delete from dbo.Comments
                    where comment_id = " + comment_id + @"
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

                return new JsonResult("Deleted Successfully");
            }
            return new JsonResult("Delete Failed");
        }
    }
}
