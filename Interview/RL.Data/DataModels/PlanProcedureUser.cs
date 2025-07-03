using System.ComponentModel.DataAnnotations;
using RL.Data.DataModels.Common;

namespace RL.Data.DataModels
{
    public class PlanProcedureUser : IChangeTrackable
    {
        // Composite key (PlanId + ProcedureId + UserId)
        public int PlanId { get; set; }
        public int ProcedureId { get; set; }
        public int UserId { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }

        // Navigation Properties (required for .Include in queries)
        public virtual Plan Plan { get; set; }
        public virtual Procedure Procedure { get; set; }
        public virtual User User { get; set; }
    }
}
