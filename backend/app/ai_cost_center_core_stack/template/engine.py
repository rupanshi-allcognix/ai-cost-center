from jinja2 import Environment, FileSystemLoader

_env = Environment(loader=FileSystemLoader("templates"))


def render(template_name: str, **kwargs) -> str:
    template = _env.get_template(template_name)
    return template.render(**kwargs)
