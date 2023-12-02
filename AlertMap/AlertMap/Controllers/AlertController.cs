using AlertMap.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;

namespace AlertMap.Controllers
{
    [Route("api/[controller]")]
    public class AlertController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        public AlertController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            // Replace by using Stored Procedures with Parameters or Entity Framework to connect to the database
            string query = @"
                    select AlertID, IsResolved, AlertType, AlertDate, AlertDescription, StreetAddress from dbo.AlertDB";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AlertAppCon");
            SqlDataReader myReader;
            using(SqlConnection myCon=new SqlConnection(sqlDataSource))
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
        public JsonResult Post(Alert alert)
        {
            string query = @"
                    insert into dbo.AlertDB values
                    (
                    '"+alert.IsResolved + @"', 
                    '"+alert.AlertType + @"', 
                    '"+alert.AlertDate + @"', 
                    '"+alert.AlertDescription + @"', 
                    '"+alert.StreetAddress + @"'
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
        public JsonResult Put(Alert alert)
        {
            string query = @"
                    update dbo.AlertDB set
                    IsResolved = '" + alert.IsResolved + @"'
                    AlertType = '" + alert.AlertType + @"'
                    AlertDate = '" + alert.AlertDate + @"'
                    AlertDescription = '" + alert.AlertDescription + @"'
                    StreetAddress = '" + alert.StreetAddress + @"'
                    where AlertID = " + alert.AlertID + @"
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

        //[HttpDelete("{id")]
        //public JsonResult Delete(int id)
        //{
        //    string query = @"
        //            delete from dbo.AlertDB
        //            where AlertID = " + id + @"
        //            ";
        //    DataTable table = new DataTable();
        //    string sqlDataSource = _configuration.GetConnectionString("AlertAppCon");
        //    SqlDataReader myReader;
        //    using (SqlConnection myCon = new SqlConnection(sqlDataSource))
        //    {
        //        myCon.Open();
        //        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        //        {
        //            myReader = myCommand.ExecuteReader();
        //            table.Load(myReader);

        //            myReader.Close();
        //            myCon.Close();
        //        }
        //    }

        //    return new JsonResult("Deleted Successfully");
        //}
    }
}
