class DelayedClone
  attr_accessor :repo_id

  def initialize(repo_id)
    self.repo_id = repo_id
  end

  def perform
    Repository.find(@repo_id).fetch_data
  end
end
