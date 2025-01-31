defmodule Oli.Institutions.PendingRegistration do
  use Ecto.Schema
  import Ecto.Changeset

  schema "pending_registrations" do
    field :country_code, :string
    field :institution_email, :string
    field :institution_url, :string
    field :name, :string

    field :issuer, :string
    field :client_id, :string
    field :deployment_id, :string
    field :key_set_url, :string
    field :auth_token_url, :string
    field :auth_login_url, :string
    field :auth_server, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(pending_registration, attrs \\ %{}) do
    pending_registration
    |> cast(attrs, [
      :name,
      :country_code,
      :institution_email,
      :institution_url,
      :issuer,
      :client_id,
      :deployment_id,
      :key_set_url,
      :auth_token_url,
      :auth_login_url,
      :auth_server
    ])
    |> validate_required([
      :name,
      :country_code,
      :institution_email,
      :institution_url,
      :issuer,
      :client_id,
      :key_set_url,
      :auth_token_url,
      :auth_login_url,
      :auth_server
    ])
  end

  def institution_attrs(%Oli.Institutions.PendingRegistration{} = pending_registration) do
    Map.from_struct(pending_registration)
    |> Map.take([
      :name,
      :country_code,
      :institution_email,
      :institution_url
    ])
  end

  def registration_attrs(%Oli.Institutions.PendingRegistration{} = pending_registration) do
    Map.from_struct(pending_registration)
    |> Map.take([
      :issuer,
      :client_id,
      :key_set_url,
      :auth_token_url,
      :auth_login_url,
      :auth_server
    ])
  end

  def deployment_attrs(%Oli.Institutions.PendingRegistration{} = pending_registration) do
    Map.from_struct(pending_registration)
    |> Map.take([
      :deployment_id
    ])
  end
end
