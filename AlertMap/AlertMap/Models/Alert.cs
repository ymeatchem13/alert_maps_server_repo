namespace AlertMap.Models
{
    public class Alert
    {
        public int AlertID { get; set; }

        public string? AlertType { get; set; }

        public DateTime AlertDate { get; set; }

        public string? AlertDescription { get; set; }

        public string? StreetAddress { get; set; }

        public Boolean IsResolved { get; set; }
    }
}
