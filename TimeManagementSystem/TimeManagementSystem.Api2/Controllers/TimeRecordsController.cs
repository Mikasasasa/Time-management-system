using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TimeManagementSystem.API;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API.Controllers
{
    public class TimeRecordsController : ApiController
    {
        private TimeManagementSystemContext db = new TimeManagementSystemContext();

        // GET: api/TimeRecords
        public IQueryable<TimeRecord> GetTimeRecors()
        {
            return db.TimeRecors;
        }

        // GET: api/TimeRecords/5
        [ResponseType(typeof(TimeRecord))]
        public IHttpActionResult GetTimeRecord(int id)
        {
            TimeRecord timeRecord = db.TimeRecors.Find(id);
            if (timeRecord == null)
            {
                return NotFound();
            }

            return Ok(timeRecord);
        }

        // PUT: api/TimeRecords/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTimeRecord(int id, TimeRecord timeRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != timeRecord.Id)
            {
                return BadRequest();
            }

            db.Entry(timeRecord).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeRecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/TimeRecords
        [ResponseType(typeof(TimeRecord))]
        public IHttpActionResult PostTimeRecord(TimeRecord timeRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TimeRecors.Add(timeRecord);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = timeRecord.Id }, timeRecord);
        }

        // DELETE: api/TimeRecords/5
        [ResponseType(typeof(TimeRecord))]
        public IHttpActionResult DeleteTimeRecord(int id)
        {
            TimeRecord timeRecord = db.TimeRecors.Find(id);
            if (timeRecord == null)
            {
                return NotFound();
            }

            db.TimeRecors.Remove(timeRecord);
            db.SaveChanges();

            return Ok(timeRecord);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TimeRecordExists(int id)
        {
            return db.TimeRecors.Count(e => e.Id == id) > 0;
        }
    }
}