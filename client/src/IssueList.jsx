import IssueCard from './IssueCard'
export default function IssueList({ issues, ...actions }) {
  return issues.length ? <div className="issue-list">{issues.map(issue => <IssueCard key={issue.id} issue={issue} {...actions} />)}</div> : <div className="empty"><h3>A clear desk.</h3><p>Create your first issue to get started.</p></div>
}
