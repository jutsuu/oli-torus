defmodule OliWeb.Curriculum.DeleteModal do
  use Phoenix.LiveComponent
  use Phoenix.HTML

  import OliWeb.Curriculum.Utils

  def render(%{revision: revision} = assigns) do
    ~L"""
    <div class="modal fade show" id="delete_<%= revision.slug %>" tabindex="-1" role="dialog" aria-hidden="true" phx-hook="BSModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delete <%= resource_type_label(revision) |> String.capitalize() %></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete "<%= revision.title %>"?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button
                phx-click="delete"
                phx-key="enter"
                phx-value-slug="<%= revision.slug %>"
                class="btn btn-danger">
                Delete <%= resource_type_label(revision) |> String.capitalize() %>
              </button>
            </div>
        </div>
      </div>
    </div>
    """
  end
end
