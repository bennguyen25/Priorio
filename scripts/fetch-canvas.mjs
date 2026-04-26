import { writeFileSync } from 'fs'

const TOKEN = '10~aN8kxh2nPKtxQz4EuYvTeE7htZERn83kDGGwMxxz39XFGNaykWDmWutfQ4UFcPze'
const BASE = 'https://canvas.uw.edu/api/v1'

const COURSE_COLORS = [
  { color: '#dc3545', bg: '#fce4e4' },
  { color: '#c9860a', bg: '#fef3d7' },
  { color: '#2471a3', bg: '#ddeef9' },
  { color: '#6d28d9', bg: '#ede9fe' },
  { color: '#065f46', bg: '#d1fae5' },
]

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

function cleanHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/\s+/g, ' ')
    .trim()
}

const rawCourses = await get('/courses?enrollment_state=active&enrollment_type=student&per_page=20')
console.log('All courses:', rawCourses.map(c => c.course_code))

const activeCourses = rawCourses
  .filter(c => c.course_code && /^[A-Z]+ \d+/.test(c.course_code) && !c.course_code.startsWith('ARCHIVED'))
  .slice(0, COURSE_COLORS.length)

console.log('Active courses:', activeCourses.map(c => c.course_code))

const courses = {}
activeCourses.forEach((c, i) => {
  const code = c.course_code.split(' ').slice(0, 2).join(' ')
  courses[code] = { ...COURSE_COLORS[i], id: c.id, name: c.name }
})

const allAssignments = await Promise.all(
  activeCourses.map(c =>
    get(`/courses/${c.id}/assignments?per_page=100&order_by=due_at`).catch(() => [])
  )
)

const tasks = []
let id = 1

activeCourses.forEach((c, ci) => {
  const code = c.course_code.split(' ').slice(0, 2).join(' ')
  const assignments = allAssignments[ci]
  console.log(`\n${code}: ${assignments.length} upcoming assignments`)
  assignments.forEach(a => {
    console.log(`  - ${a.name} | due: ${a.due_at}`)
    tasks.push({
      id: id++,
      title: a.name,
      course: code,
      dueDateISO: a.due_at || null,
      dueDate: a.due_at
        ? new Date(a.due_at).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : 'No due date',
      description: a.description || null,
      summary: a.description ? cleanHtml(a.description).slice(0, 220) || null : null,
      readings: [],
      boldNote: '',
      note: '',
      hasGuidelinesLink: false,
      submissionType: a.submission_types?.join(', ') || 'Online Upload',
      htmlUrl: a.html_url,
    })
  })
})

console.log(`\nTotal: ${tasks.length} assignments across ${Object.keys(courses).length} courses`)

writeFileSync('src/data/canvas-snapshot.json', JSON.stringify({ courses, tasks }, null, 2))
console.log('✓ Saved to src/data/canvas-snapshot.json')
