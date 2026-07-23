_prompts: dict[str, str] = {}


def get_prompt(name: str) -> str | None:
    return _prompts.get(name)


def set_prompt(name: str, content: str):
    _prompts[name] = content
