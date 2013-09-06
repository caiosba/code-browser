class RepositoryJob < Struct.new(:repository_id)
  def perform
    Repository.find(repository_id).fetch_data
  end
end
