using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeManagementSystem.API.Models
{
    public class TimeRecord
    {
		public int Id { get; set; }
		public DateTime StartDate { get; set; }
		public User User { get; set; }
		public string Note { get; set; }
		public TimeSpan Length { get; set; }
	}
}
