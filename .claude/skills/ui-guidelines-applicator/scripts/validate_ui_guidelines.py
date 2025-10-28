#!/usr/bin/env python3
"""
UI Guidelines Validator

This script validates UI components against established design guidelines.
It checks for consistency in colors, typography, spacing, and accessibility compliance.
"""

import re
import json
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass

@dataclass
class ValidationResult:
    """Represents a validation result with severity and message."""
    severity: str  # 'error', 'warning', 'info'
    message: str
    line: int = None
    column: int = None
    file: str = None

class UIGuidelinesValidator:
    """Validates UI components against design guidelines."""

    def __init__(self, config_path: str = None):
        """Initialize validator with optional config file."""
        self.config = self._load_config(config_path)
        self.colors = self.config.get('colors', {})
        self.spacing = self.config.get('spacing', {})
        self.typography = self.config.get('typography', {})

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from JSON file or use defaults."""
        default_config = {
            "colors": {
                "primary": ["#0066CC", "#004499", "#E6F2FF"],
                "secondary": ["#28A745", "#FD7E14", "#DC3545"],
                "neutral": ["#212529", "#495057", "#6C757D", "#DEE2E6", "#F8F9FA", "#FFFFFF"],
                "contrast_ratios": {"normal": 4.5, "large": 3.0}
            },
            "spacing": {
                "scale": [4, 8, 12, 16, 24, 32, 48, 64],
                "unit": "px"
            },
            "typography": {
                "font_sizes": ["11px", "12px", "14px", "16px", "18px", "22px", "28px", "36px", "48px"],
                "font_weights": ["400", "600", "700"],
                "line_heights": ["14px", "16px", "20px", "24px", "26px", "30px", "36px", "44px", "48px"]
            }
        }

        if config_path and Path(config_path).exists():
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                # Merge with defaults
                default_config.update(user_config)

        return default_config

    def validate_css_file(self, file_path: Path) -> List[ValidationResult]:
        """Validate a CSS/SCSS file against UI guidelines."""
        results = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            return [ValidationResult(
                severity='error',
                message=f"Could not read file: {e}",
                file=str(file_path)
            )]

        # Validate color usage
        results.extend(self._validate_colors(lines, file_path))

        # Validate spacing
        results.extend(self._validate_spacing(lines, file_path))

        # Validate typography
        results.extend(self._validate_typography(lines, file_path))

        # Validate accessibility
        results.extend(self._validate_accessibility(lines, file_path))

        return results

    def _validate_colors(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate color usage against color palette."""
        results = []
        all_colors = []

        # Collect all allowed colors
        for color_group in self.colors.values():
            if isinstance(color_group, list):
                all_colors.extend(color_group)

        color_pattern = re.compile(r'#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}')

        for i, line in enumerate(lines, 1):
            matches = color_pattern.findall(line)
            for match in matches:
                if match not in all_colors:
                    results.append(ValidationResult(
                        severity='warning',
                        message=f"Color '{match}' not in defined color palette",
                        line=i,
                        file=str(file_path)
                    ))

        return results

    def _validate_spacing(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate spacing values against spacing scale."""
        results = []

        # Pattern to match pixel values in CSS
        spacing_pattern = re.compile(r'(\d+)px')

        for i, line in enumerate(lines, 1):
            matches = spacing_pattern.findall(line)
            for match in matches:
                value = int(match)
                if value not in self.spacing['scale']:
                    # Check if it's a multiple of the base unit
                    base_unit = min(self.spacing['scale'])
                    if value % base_unit != 0:
                        results.append(ValidationResult(
                            severity='warning',
                            message=f"Spacing value {value}px not in spacing scale and not multiple of {base_unit}px",
                            line=i,
                            file=str(file_path)
                        ))

        return results

    def _validate_typography(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate typography values against guidelines."""
        results = []

        # Pattern to match font sizes and weights
        font_size_pattern = re.compile(r'font-size:\s*(\d+px|\d+rem|\d+em)')
        font_weight_pattern = re.compile(r'font-weight:\s*(\d+|[a-z]+)')

        for i, line in enumerate(lines, 1):
            # Validate font sizes
            size_match = font_size_pattern.search(line)
            if size_match:
                size_value = size_match.group(1)
                # Allow rem values as they can be relative to base font size
                if 'px' in size_value and size_value not in self.typography['font_sizes']:
                    results.append(ValidationResult(
                        severity='info',
                        message=f"Font size '{size_value}' not in defined typography scale",
                        line=i,
                        file=str(file_path)
                    ))

            # Validate font weights
            weight_match = font_weight_pattern.search(line)
            if weight_match:
                weight_value = weight_match.group(1)
                if weight_value.isdigit() and weight_value not in self.typography['font_weights']:
                    results.append(ValidationResult(
                        severity='warning',
                        message=f"Font weight '{weight_value}' not in allowed font weights",
                        line=i,
                        file=str(file_path)
                    ))

        return results

    def _validate_accessibility(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate accessibility requirements."""
        results = []

        # Check for focus styles
        focus_pattern = re.compile(r':focus')
        outline_none_pattern = re.compile(r'outline:\s*none')

        has_focus_styles = any(focus_pattern.search(line) for line in lines)
        has_outline_none = any(outline_none_pattern.search(line) for line in lines)

        if has_outline_none and not has_focus_styles:
            results.append(ValidationResult(
                severity='error',
                message="Outline removed without alternative focus styles - accessibility issue",
                file=str(file_path)
            ))

        # Check for color-only contrast information
        color_only_indicators = re.compile(r'color:\s*#[0-9A-Fa-f]{6}')
        has_color_indicators = any(color_only_indicators.search(line) for line in lines)

        if has_color_indicators:
            results.append(ValidationResult(
                severity='info',
                message="Consider adding non-color indicators (icons, borders, underlines) for better accessibility",
                file=str(file_path)
            ))

        return results

    def validate_jsx_file(self, file_path: Path) -> List[ValidationResult]:
        """Validate JSX/TSX file for accessibility and structure."""
        results = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            return [ValidationResult(
                severity='error',
                message=f"Could not read file: {e}",
                file=str(file_path)
            )]

        # Check for semantic HTML
        results.extend(self._validate_semantic_html(lines, file_path))

        # Check for accessibility attributes
        results.extend(self._validate_a11y_attributes(lines, file_path))

        return results

    def _validate_semantic_html(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate semantic HTML usage."""
        results = []

        # Check for excessive div usage
        div_count = sum(line.count('<div') for line in lines)
        if div_count > 10:
            results.append(ValidationResult(
                severity='info',
                message=f"High number of div elements ({div_count}). Consider using semantic HTML tags",
                file=str(file_path)
            ))

        # Check for semantic alternatives
        semantic_tags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer']
        has_semantic = any(any(f'<{tag}' in line for line in lines) for tag in semantic_tags)

        if not has_semantic:
            results.append(ValidationResult(
                severity='warning',
                message="No semantic HTML tags found. Consider using semantic tags for better accessibility",
                file=str(file_path)
            ))

        return results

    def _validate_a11y_attributes(self, lines: List[str], file_path: Path) -> List[ValidationResult]:
        """Validate accessibility attributes."""
        results = []

        content = '\n'.join(lines)

        # Check for alt attributes on images
        img_tags = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
        for img_tag in img_tags:
            if 'alt=' not in img_tag.lower():
                results.append(ValidationResult(
                    severity='error',
                    message="Image found without alt attribute",
                    file=str(file_path)
                ))

        # Check for aria-labels on interactive elements without text
        button_pattern = re.compile(r'<button[^>]*>([^<]*)</button>', re.IGNORECASE)
        buttons = button_pattern.findall(content)
        for i, button_text in enumerate(buttons):
            if not button_text.strip():
                results.append(ValidationResult(
                    severity='warning',
                    message=f"Button {i+1} has no visible text - consider adding aria-label",
                    file=str(file_path)
                ))

        return results

    def generate_report(self, results: List[ValidationResult], output_format: str = 'text') -> str:
        """Generate validation report in specified format."""
        if output_format == 'json':
            return json.dumps([{
                'severity': r.severity,
                'message': r.message,
                'line': r.line,
                'column': r.column,
                'file': r.file
            } for r in results], indent=2)

        # Text format
        report = []
        report.append("UI Guidelines Validation Report")
        report.append("=" * 40)

        # Group by severity
        errors = [r for r in results if r.severity == 'error']
        warnings = [r for r in results if r.severity == 'warning']
        info = [r for r in results if r.severity == 'info']

        if errors:
            report.append(f"\n❌ ERRORS ({len(errors)}):")
            for error in errors:
                location = f" ({error.file}:{error.line})" if error.line else f" ({error.file})"
                report.append(f"  • {error.message}{location}")

        if warnings:
            report.append(f"\n⚠️  WARNINGS ({len(warnings)}):")
            for warning in warnings:
                location = f" ({warning.file}:{warning.line})" if warning.line else f" ({warning.file})"
                report.append(f"  • {warning.message}{location}")

        if info:
            report.append(f"\nℹ️  INFO ({len(info)}):")
            for info_item in info:
                location = f" ({info_item.file}:{info_item.line})" if info_item.line else f" ({info_item.file})"
                report.append(f"  • {info_item.message}{location}")

        if not results:
            report.append("\n✅ No issues found!")

        report.append(f"\nTotal: {len(results)} issues")

        return '\n'.join(report)

def main():
    """Main entry point for CLI usage."""
    parser = argparse.ArgumentParser(description='Validate UI components against guidelines')
    parser.add_argument('paths', nargs='+', help='Files or directories to validate')
    parser.add_argument('--config', help='Path to configuration file')
    parser.add_argument('--format', choices=['text', 'json'], default='text', help='Output format')
    parser.add_argument('--output', help='Output file (default: stdout)')

    args = parser.parse_args()

    validator = UIGuidelinesValidator(args.config)
    all_results = []

    for path in args.paths:
        path_obj = Path(path)

        if path_obj.is_file():
            if path_obj.suffix in ['.css', '.scss', '.sass']:
                all_results.extend(validator.validate_css_file(path_obj))
            elif path_obj.suffix in ['.jsx', '.tsx']:
                all_results.extend(validator.validate_jsx_file(path_obj))
        elif path_obj.is_dir():
            # Recursively find relevant files
            for css_file in path_obj.rglob('*.css'):
                all_results.extend(validator.validate_css_file(css_file))
            for scss_file in path_obj.rglob('*.scss'):
                all_results.extend(validator.validate_css_file(scss_file))
            for jsx_file in path_obj.rglob('*.jsx'):
                all_results.extend(validator.validate_jsx_file(jsx_file))
            for tsx_file in path_obj.rglob('*.tsx'):
                all_results.extend(validator.validate_jsx_file(tsx_file))

    report = validator.generate_report(all_results, args.format)

    if args.output:
        with open(args.output, 'w') as f:
            f.write(report)
        print(f"Report written to {args.output}")
    else:
        print(report)

    # Exit with error code if there are errors
    errors_count = len([r for r in all_results if r.severity == 'error'])
    sys.exit(1 if errors_count > 0 else 0)

if __name__ == '__main__':
    main()