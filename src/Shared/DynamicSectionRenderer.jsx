// dus-frontend/src/Shared/DynamicSectionRenderer.jsx

// React
import { Suspense } from 'react';

// Import section loader
import SectionLoader from './SectionLoader';

// Import section registry
import { SECTION_COMPONENTS, SECTION_CONFIGS } from '../config/sectionRegistry';

const DynamicSectionRenderer = ({
  section,
  pageData,
  globalProps = {}
}) => {
  const {
    id,
    component: componentName,
    propName,
    dataKey,
    // Handle both field names
    custom_props,
    customProps: customPropsCamel,
  } = section;

  // Get the component from registry
  const Component = SECTION_COMPONENTS[componentName];

  if (!Component) {
    return null;
  }

  // Use the correct field name (prefer custom_props from database)
  const rawCustomProps = custom_props || customPropsCamel || {};

  // Parse customProps if it's a string
  let parsedCustomProps = {};
  if (typeof rawCustomProps === 'string') {
    try {
      const parsed = JSON.parse(rawCustomProps);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsedCustomProps = parsed;
      }
    } catch (e) {
      console.warn(`[DynamicSectionRenderer] Failed to parse customProps for ${componentName}:`, e);
    }
  } else if (rawCustomProps && typeof rawCustomProps === 'object' && !Array.isArray(rawCustomProps)) {
    parsedCustomProps = rawCustomProps;
  }

  // Build component props - parsedCustomProps should override globalProps
  let componentProps = { ...globalProps, ...parsedCustomProps };

  // Get config for this component
  const config = SECTION_CONFIGS[componentName];

  if (config?.isMultiProp) {
    config.props.forEach(prop => {
      if (pageData[prop] !== undefined) {
        componentProps[prop] = pageData[prop];
      }
    });
  } else if (propName && dataKey) {
    let dataValue = pageData[dataKey];

    if (dataValue === undefined && dataKey) {
      const kebabKey = dataKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabKey];
    }

    if (dataValue === undefined && propName) {
      dataValue = pageData[propName];
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (dataValue === undefined) {
        dataValue = pageData[kebabPropName];
      }
    }

    componentProps[propName] = dataValue;
  } else if (propName) {
    let dataValue = pageData[propName];
    if (dataValue === undefined) {
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabPropName];
    }
    componentProps[propName] = dataValue;
  }

  // If component expects 'data' prop, try to find it
  if (componentProps[propName] === undefined) {
    const possibleKeys = [
      section.data_key,
      propName,
      section.data_key?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      propName?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      componentName.replace('Section', '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    ];

    for (const key of possibleKeys) {
      if (key && pageData[key] !== undefined) {
        componentProps[propName || 'data'] = pageData[key];
        break;
      }
    }
  }

  return (
    <Suspense fallback={<SectionLoader message={`Loading ${id}...`} />}>
      <Component {...componentProps} />
    </Suspense>
  );
};

export default DynamicSectionRenderer;