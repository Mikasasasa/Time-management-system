using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeManagementSystem.API.Models
{
    public class User
    {
		public int Id { get; set; }
		public string Login { get; set; }
		public string Password { get; set; }
		//permissionLevel
		public int PreferredWorkingHourPerDay { get; set; }
	}
}
