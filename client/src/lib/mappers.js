export const mapCharity = (charity, index = 0) => {
  const icons = ['E', 'H', 'ENV', 'C', 'V', 'A']
  const categories = ['Education', 'Healthcare', 'Environment', 'Community', 'Veterans', 'Animals']
  const supporters = 100 + index * 25
  const raised = supporters * 150
  const goal = Math.max(raised + 10000, 50000)

  return {
    ...charity,
    id: charity._id,
    icon: charity.icon || icons[index % icons.length],
    category: charity.category || categories[index % categories.length],
    supporters: charity.supporters ?? supporters,
    raised: charity.raised ?? raised,
    goal: charity.goal ?? goal,
  }
}
