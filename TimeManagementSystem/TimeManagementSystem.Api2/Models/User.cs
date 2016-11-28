using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TimeManagementSystem.API.Models
{
    public class User
    {
		public string Id { get; set; }
		public string Login { get; set; }
		public string Password { get; set; }
		public PermissionLevel PermissionLevel { get; set; }
		public int? PreferredWorkingHourPerDay { get; set; }

		//public virtual ICollection<TimeRecord> TimeRecords { get; set; }
	}
}
