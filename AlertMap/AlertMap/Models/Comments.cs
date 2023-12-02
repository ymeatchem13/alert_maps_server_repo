namespace AlertMap.Models
{
    public class Comments
    {
        public int alert_id { get; set; }

        public int comment_id { get; set; }

        public string? comment { get; set; }

        public string user_name { get; set; }

        public DateTime added_date { get; set; }
    }
}
