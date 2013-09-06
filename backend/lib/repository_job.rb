class RepositoryJob < Struct.new(:repository_id)
  def perform
    f = File.open('/tmp/bla', 'w+'); f.puts('Test'); f.close
    Repository.find(repository_id).fetch_data
  end
end
