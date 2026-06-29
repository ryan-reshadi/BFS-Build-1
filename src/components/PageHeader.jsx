export function PageHeader({ activeSetName, title, lead, actions }) {
  return (
    <div className="page-header">
      <p className="set-context">
        Study set: <strong>{activeSetName}</strong>
      </p>
      <div className="page-header-row">
        <h1>{title}</h1>
        {actions}
      </div>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}
