class Api::V1::TasksController < ApplicationController
  before_action :authenticate_user!
  def index
    if user_signed_in?
      currentTasks = current_user.tasks
      task = Task.all.order(created_at: :asc)
      render json: currentTasks
    else
      render json: {}, status: 401
    end
  end

  def create
    if user_signed_in?
      if currentTask = current_user.tasks.create(task_params)
        render json: currentTask, status: :created
      else
        render json: task.errors
      end
    #task = Task.create!(task_params)
    else 
      render json: {}, status: 401
    end
  end

  def show
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def destroy
    task&.destroy
    render json: { message: 'Task deleted!' }
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    if task.update(task_params)
      render json: task
    else
      render json: task.errors
    end
  end

  def search
    @tasks = Task.search(params[:query])
    if request.xhr?
      render :json => @songs.to_json
    else
      render :index
    end
  end

  private
    def task
      @task ||= Task.find(params[:id])
    end

    def task_params
      params.permit(:title, :tag, :user_id)
    end

end
