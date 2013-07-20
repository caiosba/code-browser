class RepositoriesController < ApplicationController
  respond_to :json

  # GET /repositories/1.json
  def show
    @repository = Repository.find_by_id(params[:id])

    if @repository.nil?
      format.json { render json: {}, status: :not_found }
    else
      format.json { render json: @repository, status: @repository.status, location: @repository }
    end
  end

  # POST /repositories.json
  def create
    @repository = Repository.new(:url => params[:url].to_s)

    if @repository.save
      format.json { render json: @repository, status: :created, location: @repository }
    else
      format.json { render json: @repository.errors, status: :unprocessable_entity }
    end
  end

end
