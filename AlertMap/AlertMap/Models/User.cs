namespace AlertMap.Models
{
    public class User ///: IUser
    {
        public string DisplayName { get; set; }
        public string EmailAddress { get; set; }

        //private readonly IHttpContextAccessor _context;

        //public User(IHttpContextAccessor context)
        //{
        //    _context = context;
        //}

        //public void GetContext()
        //{
        //    var a = _context;
        //}
    }
}
