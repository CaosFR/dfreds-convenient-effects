import {
    ActiveEffectSource,
    EffectChangeData,
} from "types/foundry/common/documents/active-effect.js";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { Settings } from "../settings.ts";
import { log } from "../logger.ts";
import { Flags } from "./flags.ts";

interface ICreateItemAddOns {
    item: PreCreate<ItemSource>;
}

// TODO method for hiding/showing individual effects/folder from players using IS_VIEWABLE
interface ICreateEffectAddOns {
    effect: PreCreate<ActiveEffectSource>;
    isTemporary?: boolean; // TODO determines if we add our own status
    isViewable?: boolean;
    isDynamic?: boolean;
    atlChanges?: DeepPartial<EffectChangeData>[];
    tokenMagicChanges?: DeepPartial<EffectChangeData>[];
    nestedEffectIds?: string[];
    subEffectIds?: string[];
    otherEffectIds?: string[];
}

function createConvenientItem({
    item,
}: ICreateItemAddOns): PreCreate<ItemSource> {
    Flags.setIsConvenient(item, true);
    Flags.setIsViewable(item, true);

    item.img =
        item.img ?? "modules/dfreds-convenient-effects/images/magic-palm.svg";

    return item;
}

function createConvenientEffect({
    effect,
    isTemporary = true,
    isViewable = true,
    isDynamic = false,
    atlChanges,
    tokenMagicChanges,
    nestedEffectIds,
    subEffectIds,
    otherEffectIds,
}: ICreateEffectAddOns): PreCreate<ActiveEffectSource> {
    Flags.setCeEffectId(effect, createCeEffectId(effect.name));
    Flags.setIsConvenient(effect, true);
    Flags.setIsViewable(effect, isViewable);
    Flags.setIsDynamic(effect, isDynamic);

    if (nestedEffectIds) {
        Flags.setNestedEffectIds(effect, nestedEffectIds);
    }
    if (subEffectIds) {
        Flags.setSubEffectIds(effect, subEffectIds);
    }
    if (otherEffectIds) {
        Flags.setOtherEffectIds(effect, otherEffectIds);
    }

    if (isTemporary) {
        log("isTemp"); // TODO remove or do something for making passive effects
    }

    const settings = new Settings();
    if (settings.integrateWithAte && atlChanges) {
        (effect.changes ?? []).push(...atlChanges);
    }

    if (settings.integrateWithTokenMagic && tokenMagicChanges) {
        (effect.changes ?? []).push(...tokenMagicChanges);
    }

    return effect;
}

function createCeEffectId(effectName?: string): string {
    return `ce-${effectName?.slugify({ strict: true })}`;
}

export { createCeEffectId, createConvenientItem, createConvenientEffect };
