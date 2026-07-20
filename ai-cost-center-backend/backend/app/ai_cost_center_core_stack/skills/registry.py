_skills: dict[str, dict] = {}


def register_skill(name: str, handler: str):
    _skills[name] = {"handler": handler}


def get_skill(name: str) -> dict | None:
    return _skills.get(name)


def list_skills() -> list[str]:
    return list(_skills.keys())
