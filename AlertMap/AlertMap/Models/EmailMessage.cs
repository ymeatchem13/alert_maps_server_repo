namespace AlertMap
{
    public class EmailMessage
    {
        public EmailMessage()
        {
            //ToAddresses = new List<Address>();
            //FromAddresses = new List<Address>();
        }

        //public List<Address> ToAddresses { get; set; }
        //public List<Address> FromAddresses { get; set; }
        public string To { get; set; } = String.Empty;
        public string From { get; set; }
        public string Subject { get; set; } = String.Empty;
        public string Content { get; set; } = String.Empty;

    }
}
