class Repository < ActiveRecord::Base

  # TODO: Add Google Code and Gitorious
  # (name / rule to get repository clone path)
  SUPPORTED_PROVIDERS = {
    github: /^(https?:\/\/github\.com\/[^\/]+\/[^\/]+)/
  }

  # TODO: Add more tools here, like Analizo
  # (name / path to executable that receives a URL and returns data)
  TOOLS = {
    'gitshortlog' => File.join(Rails.root, 'tools', 'gitshortlog'),
    'gitlineschanged' => File.join(Rails.root, 'tools', 'gitlineschanged')
  }

  attr_accessible :url, :data, :repo_url, :provider, :tool

  validate :url_is_supported
  validates_presence_of :url

  before_create :get_repository
  after_create :queue_fetch_data

  def fetch_data
    self.data = %x['#{Repository::TOOLS[self.tool]}' #{self.repo_url}]
    self.status = 'done'
    self.save!
  end

  private

  def url_is_supported
    Repository::SUPPORTED_PROVIDERS.each do |name, rule|
      return true if rule.match(self.url)
    end
    errors.add(:url, 'URL is not supported')
  end

  def get_repository
    Repository::SUPPORTED_PROVIDERS.each do |name, rule|
      match = rule.match(self.url)
      unless match.nil?
        self.provider = name.to_s
        self.repo_url = match[1]
        self.status = 'created'
        return true
      end
    end
    false
  end

  def queue_fetch_data
    require File.join(Rails.root, 'lib', 'repository_job')
    Delayed::Job.enqueue RepositoryJob.new(self.id)
    self.status = 'queued'
    self.save!
  end

end
