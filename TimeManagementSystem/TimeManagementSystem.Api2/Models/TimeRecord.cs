using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TimeManagementSystem.API.Models
{
    public class TimeRecord
    {
		public int Id { get; set; }
		public DateTime StartDate { get; set; }
		public string Note { get; set; }
		public int Length { get; set; }
		public string UserId { get; set; }
	}
}
